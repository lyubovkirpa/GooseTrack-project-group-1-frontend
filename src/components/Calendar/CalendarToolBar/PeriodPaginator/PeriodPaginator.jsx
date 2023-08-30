import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import {
  addDays,
  addMonths,
  format,
  parse,
  subDays,
  subMonths,
} from 'date-fns';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import {
  ControlWrapper,
  DatePickerWrapper,
} from 'components/Calendar/CalendarToolBar/PeriodPaginator/PeriodPaginator.styled';
import { Controls } from './PeriodPaginator.styled';

import {
  selectActiveDate,
  selectPeriodType,
  selectSelectedDate,
} from 'redux/date/selectors';
import { useEffect, useRef } from 'react';
import { fetchTasks } from 'redux/tasks/tasksOperations';
import { setActiveDate, setSelectedDate } from 'redux/date/dateSlice';

export const PeriodPaginator = () => {
  const dispatch = useDispatch();

  const periodType = useSelector(selectPeriodType);
  const currentDate = useSelector(selectActiveDate);
  const selectedDate = useSelector(selectSelectedDate);

  const prevDateRef = useRef(parse(currentDate, 'yyyy-MM-dd', new Date()));
  // console.log(prevDateRef, 'prevDateRef-11');

  const date =
    periodType === 'month'
      ? parse(currentDate, 'yyyy-MM-dd', new Date())
      : parse(selectedDate, 'yyyy-MM-dd', new Date());

  useEffect(() => {
    if (format(date, 'yyyy-MM') !== format(prevDateRef.current, 'yyyy-MM')) {
      dispatch(fetchTasks(format(date, 'yyyy-MM')));
    }
  }, [dispatch, date, currentDate]);

  useEffect(() => {
    prevDateRef.current = parse(currentDate, 'yyyy-MM-dd', new Date());
  }, [currentDate]);

  return (
    <>
      <ControlWrapper>
        <DatePickerWrapper>
          <ReactDatePicker
            selected={date}
            onChange={value => {
              dispatch(setSelectedDate(format(value, 'yyyy-MM-dd')));
              dispatch(setActiveDate(format(value, 'yyyy-MM-dd')));
            }}
            calendarStartDay={1}
            // showMonthYearPicker
            dateFormat={periodType === 'month' ? 'MMMM yyyy' : 'dd MMMM yyyy'}
            closeOnScroll={true}
            formatWeekDay={nameOfDay => nameOfDay.substr(0, 1)}
            // minDate={'02-01-2020'}
            todayButton="Today"
          />
        </DatePickerWrapper>
        <div>
          <Controls
            type="button"
            onClick={() => {
              if (periodType === 'month') {
                dispatch(
                  setActiveDate(format(subMonths(date, 1), 'yyyy-MM-dd'))
                );
              } else {
                dispatch(
                  setSelectedDate(format(subDays(date, 1), 'yyyy-MM-dd'))
                );
              }
            }}
          >
            <AiOutlineLeft />
          </Controls>
          <Controls
            type="button"
            onClick={() => {
              if (periodType === 'month') {
                dispatch(
                  setActiveDate(format(addMonths(date, 1), 'yyyy-MM-dd'))
                );
              } else {
                dispatch(
                  setSelectedDate(format(addDays(date, 1), 'yyyy-MM-dd'))
                );
              }
            }}
          >
            <AiOutlineRight />
          </Controls>
        </div>
      </ControlWrapper>
    </>
  );
};
